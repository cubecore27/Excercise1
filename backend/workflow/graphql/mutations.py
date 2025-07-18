import graphene
import uuid
from django.db import transaction
from django.db.models import Q
from workflow.models import Workflows, Roles, Steps, Transitions
from workflow.graphql.types import WorkflowType


# --- Input Object Types ---

class StepInput(graphene.InputObjectType):
    step_id = graphene.String(required=True)
    instruction = graphene.String()
    role_id = graphene.UUID()

class TransitionInput(graphene.InputObjectType):
    transition_id = graphene.String(required=True)
    name = graphene.String()
    from_step_id = graphene.String()
    to_step_id = graphene.String()

class WorkflowInput(graphene.InputObjectType):
    workflow_id = graphene.String(required=True)
    category = graphene.String()
    sub_category = graphene.String()
    department = graphene.String()
    status = graphene.String()
    is_published = graphene.Boolean()
    steps = graphene.List(StepInput)
    transitions = graphene.List(TransitionInput)


# --- Create or Update Workflow Mutation ---

class CreateOrUpdateWorkflow(graphene.Mutation):
    class Arguments:
        input = WorkflowInput(required=True)

    workflow = graphene.Field(WorkflowType)

    @transaction.atomic
    def mutate(self, info, input):
        # ----------------------------
        # 1. Create or update workflow
        # ----------------------------
        # --- Safely construct defaults based on input presence ---
        # If present: update, If empty: retain

        defaults = {}
        for field in ["category", "sub_category", "department", "status", "is_published"]:
            if hasattr(input, field):
                value = getattr(input, field)
                if value is not None:
                    defaults[field] = value

        # --- Create or update the workflow with safe defaults ---
        workflow, _ = Workflows.objects.update_or_create(
            workflow_id=input.workflow_id,
            defaults=defaults
        )

        # ----------------------------
        # 2. Sync Steps
        # ----------------------------
        step_ids = []

        for step_input in input.steps or []:
            # 2.1 Resolve Role object for this step
            role = Roles.objects.get(role_id=step_input.role_id)

            # 2.2 Create or update step using step_id as unique key
            step_obj, _ = Steps.objects.update_or_create(
                step_id=step_input.step_id,
                defaults={
                    "workflow": workflow,
                    "instruction": step_input.instruction,
                    "role_id": role,
                }
            )

            # 2.3 Track processed step_ids to prevent accidental deletion
            step_ids.append(step_obj.step_id)

        # 2.4 Delete steps in DB that were not included in the input
        Steps.objects.filter(workflow=workflow).exclude(step_id__in=step_ids).delete()

        # ----------------------------
        # 3. Sync Transitions
        # ----------------------------
        transition_ids = []

        for t_input in input.transitions or []:
            # 3.1 Resolve from_step and to_step objects
            from_step = Steps.objects.get(step_id=t_input.from_step_id)
            to_step = Steps.objects.get(step_id=t_input.to_step_id)

            # 3.2 Create or update transition by transition_id
            trans_obj, _ = Transitions.objects.update_or_create(
                transition_id=t_input.transition_id,
                defaults={
                    "from_step": from_step,
                    "to_step": to_step,
                    "name": t_input.name
                }
            )

            # 3.3 Track processed transition_ids
            transition_ids.append(trans_obj.transition_id)

        # 3.4 Delete transitions not in input, but still tied to this workflow
        Transitions.objects.filter(
            Q(from_step__workflow=workflow) | Q(to_step__workflow=workflow)
        ).exclude(transition_id__in=transition_ids).delete()

        # ----------------------------
        # 4. Return updated Workflow
        # ----------------------------
        return CreateOrUpdateWorkflow(workflow=workflow)


# --- Main Mutation Class ---

class Mutation(graphene.ObjectType):
    create_or_update_workflow = CreateOrUpdateWorkflow.Field()
