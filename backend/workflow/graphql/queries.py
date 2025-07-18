import graphene
from workflow.models import Workflows, Roles, Steps, Transitions
from workflow.graphql.types import WorkflowType, RoleType, StepType, TransitionType

class Query(graphene.ObjectType):
    all_workflows = graphene.List(WorkflowType)
    workflow = graphene.Field(WorkflowType, 
                              id=graphene.ID(required=False),
                              workflow_id=graphene.UUID(required=False),
                              )
    roles = graphene.List(RoleType)
    steps = graphene.List(StepType)
    transitions = graphene.List(TransitionType)

    def resolve_workflow(self, info, **kwargs):
        try:
            return Workflows.objects.get(**kwargs)
        except Workflows.DoesNotExist:
            return None


    def resolve_all_workflows(root, info):
        return Workflows.objects.all()

    def resolve_roles(root, info):
        return Roles.objects.all()

    def resolve_steps(root, info):
        return Steps.objects.all()

    def resolve_transitions(root, info):
        return Transitions.objects.all()
    