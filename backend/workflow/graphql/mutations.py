import graphene
import uuid
from django.db import transaction
from django.db.models import Q
from workflow.models import Workflows, Roles, Steps, Transitions
from workflow.graphql.types import WorkflowType


# --- Input Object Types ---

class StepInput(graphene.InputObjectType):
    step_id = graphene.String(required=True)
    instruction = graphene.String(required=True)
    role_id = graphene.UUID(required=True)

class TransitionInput(graphene.InputObjectType):
    transition_id = graphene.String(required=True)
    name = graphene.String(required=True)
    from_step_id = graphene.String(required=True)
    to_step_id = graphene.String(required=True)

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
        # Get or create workflow
        workflow, _ = Workflows.objects.update_or_create(
            workflow_id=input.workflow_id,
            defaults={
                "category": input.category,
                "sub_category": input.sub_category,
                "department": input.department,
                "status": input.status,
                "is_published": input.is_published,
            }
        )

        # Sync Steps
        step_ids = []
        for step_input in input.steps or []:
            role = Roles.objects.get(role_id=step_input.role_id)
            step_obj, _ = Steps.objects.update_or_create(
                step_id=step_input.step_id,
                defaults={
                    "workflow": workflow,
                    "instruction": step_input.instruction,
                    "role_id": role,
                }
            )
            step_ids.append(step_obj.step_id)

        Steps.objects.filter(workflow=workflow).exclude(step_id__in=step_ids).delete()

        # Sync Transitions
        transition_ids = []
        for t_input in input.transitions or []:
            from_step = Steps.objects.get(step_id=t_input.from_step_id)
            to_step = Steps.objects.get(step_id=t_input.to_step_id)
            trans_obj, _ = Transitions.objects.update_or_create(
                transition_id=t_input.transition_id,
                defaults={
                    "from_step": from_step,
                    "to_step": to_step,
                    "name": t_input.name
                }
            )
            transition_ids.append(trans_obj.transition_id)

        Transitions.objects.filter(
            Q(from_step__workflow=workflow) | Q(to_step__workflow=workflow)
        ).exclude(transition_id__in=transition_ids).delete()

        return CreateOrUpdateWorkflow(workflow=workflow)


# --- Main Mutation Class ---

class Mutation(graphene.ObjectType):
    create_or_update_workflow = CreateOrUpdateWorkflow.Field()
