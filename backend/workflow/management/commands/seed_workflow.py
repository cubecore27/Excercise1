import random
import uuid

from django.core.management.base import BaseCommand
from workflow.models import Workflows, Roles, Steps, Transitions

CATEGORIES = ["HR", "IT", "Finance", "Logistics", "Marketing"]
SUB_CATEGORIES = ["Leave", "Onboarding", "Procurement", "Payroll", "Performance"]
DEPARTMENTS = ["HR", "Tech", "Finance", "Operations", "Sales"]
STATUSES = ["draft", "published", "archived"]


class Command(BaseCommand):
    help = "Seed the database with randomized workflows, roles, steps, and transitions"

    def handle(self, *args, **kwargs):
        # Clear existing data
        Transitions.objects.all().delete()
        Steps.objects.all().delete()
        Roles.objects.all().delete()
        Workflows.objects.all().delete()

        self.stdout.write("🧹 Cleared existing workflow data")

        # Generate roles (shared across workflows)
        roles = []
        for i in range(10):
            role = Roles.objects.create(
                role_id=uuid.uuid4(),
                system_id=uuid.uuid4()
            )
            roles.append(role)
        self.stdout.write(self.style.SUCCESS(f"✅ Created {len(roles)} roles"))

        # Generate workflows
        for i in range(5):
            workflow = Workflows.objects.create(
                workflow_id=uuid.uuid4(),
                category=random.choice(CATEGORIES),
                sub_category=random.choice(SUB_CATEGORIES),
                department=random.choice(DEPARTMENTS),
                status=random.choice(STATUSES),
                is_published=random.choice([True, False]),
            )
            self.stdout.write(f"🔁 Workflows {i+1}: {workflow.category}/{workflow.sub_category}")

            # Create 3–5 steps
            num_steps = random.randint(3, 5)
            steps = []
            for j in range(num_steps):
                role = random.choice(roles)
                step = Steps.objects.create(
                    step_id=uuid.uuid4(),
                    workflow=workflow,
                    role_id=role,
                    instruction=f"Steps {j+1}: instruction for role {role.id}"
                )
                steps.append(step)

            self.stdout.write(self.style.SUCCESS(f"  ↳ {len(steps)} steps created"))

            # Create linear transitions (step 1 → 2 → 3 → ...)
            for j in range(len(steps) - 1):
                transition = Transitions.objects.create(
                    transition_id=uuid.uuid4(),
                    from_step=steps[j],
                    to_step=steps[j + 1],
                    name=f"Transitions {j+1}"
                )

            self.stdout.write(self.style.SUCCESS(f"  ↳ {len(steps) - 1} transitions created"))

        self.stdout.write(self.style.SUCCESS("🎉 Successfully seeded 5 randomized workflows!"))
