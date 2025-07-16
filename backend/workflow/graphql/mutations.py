import graphene
from workflow.models import Workflows, Roles, Steps, Transitions
from workflow.graphql.types import WorkflowType, RoleType, StepType, TransitionType
import uuid

class CreateWorkflow(graphene.Mutation):
    class Arguments:
        category = graphene.String(required=True)
        sub_category = graphene.String(required=True)
        department = graphene.String(required=True)
        is_published = graphene.Boolean()
        status = graphene.String(required=True)

    workflow = graphene.Field(WorkflowType)

    def mutate(self, info, category, sub_category, department, status, is_published=None):
        workflow = Workflows.objects.create(
            workflow_id=uuid.uuid4(),
            category=category,
            sub_category=sub_category,
            department=department,
            status=status,
            is_published=is_published,
        )
        return CreateWorkflow(workflow=workflow)


class CreateRole(graphene.Mutation):
    class Arguments:
        system_id = graphene.UUID(required=True)

    role = graphene.Field(RoleType)

    def mutate(self, info, system_id):
        role = Roles.objects.create(
            role_id=uuid.uuid4(),
            system_id=system_id
        )
        return CreateRole(role=role)


class CreateStep(graphene.Mutation):
    class Arguments:
        workflow_id = graphene.UUID(required=True)
        role_id = graphene.UUID(required=True)
        instruction = graphene.String()

    step = graphene.Field(StepType)

    def mutate(self, info, workflow_id, role_id, instruction=None):
        step = Steps.objects.create(
            step_id=uuid.uuid4(),
            workflow_id=workflow_id,
            role_id=role_id,
            instruction=instruction
        )
        return CreateStep(step=step)


class CreateTransition(graphene.Mutation):
    class Arguments:
        from_step_id = graphene.UUID(required=True)
        to_step_id = graphene.UUID(required=True)
        name = graphene.String(required=True)

    transition = graphene.Field(TransitionType)

    def mutate(self, info, from_step_id, to_step_id, name):
        transition = Transitions.objects.create(
            transition_id=uuid.uuid4(),
            from_step_id=from_step_id,
            to_step_id=to_step_id,
            name=name
        )
        return CreateTransition(transition=transition)


class Mutation(graphene.ObjectType):
    create_workflow = CreateWorkflow.Field()
    create_role = CreateRole.Field()
    create_step = CreateStep.Field()
    create_transition = CreateTransition.Field()
