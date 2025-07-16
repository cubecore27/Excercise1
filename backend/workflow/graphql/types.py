import graphene
from graphene_django import DjangoObjectType
from workflow.models import Workflows, Roles, Steps, Transitions

class StepInWorkflowType(DjangoObjectType):
    class Meta:
        model = Steps
        fields = ("id", "step_id", "role_id", "instruction")

class WorkflowType(DjangoObjectType):
    steps = graphene.List(StepInWorkflowType)  # custom field

    class Meta:
        model = Workflows
        fields = ("id", "workflow_id", "category", "sub_category", "department", "status", "is_published")

    def resolve_steps(self, info):
        return self.steps_set.all()


class RoleType(DjangoObjectType):
    class Meta:
        model = Roles
        fields = ("id","role_id")

class StepType(DjangoObjectType):
    class Meta:
        model = Steps
        fields = "__all__"


class TransitionType(DjangoObjectType):
    class Meta:
        model = Transitions
        fields = "__all__"
