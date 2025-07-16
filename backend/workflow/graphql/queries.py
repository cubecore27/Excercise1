import graphene
from workflow.models import Workflows, Roles, Steps, Transitions
from workflow.graphql.types import WorkflowType, RoleType, StepType, TransitionType

class Query(graphene.ObjectType):
    all_workflows = graphene.List(WorkflowType)
    all_roles = graphene.List(RoleType)
    all_steps = graphene.List(StepType)
    all_transitions = graphene.List(TransitionType)

    def resolve_all_workflows(root, info):
        return Workflows.objects.all()

    def resolve_all_roles(root, info):
        return Roles.objects.all()

    def resolve_all_steps(root, info):
        return Steps.objects.all()

    def resolve_all_transitions(root, info):
        return Transitions.objects.all()
    