import graphene
from graphene_django import DjangoObjectType
from workflow.models import Workflows, Roles, Steps, Transitions
from django.db.models import Q


class RoleType(DjangoObjectType):
    class Meta:
        model = Roles
        exclude = ("steps_set","","")  # Add fields to exclude if needed later


class StepType(DjangoObjectType):
    class Meta:
        model = Steps
        exclude = ("workflow", "step_instances_set", "transitions_from", "transitions_to")


class TransitionType(DjangoObjectType):
    from_step = graphene.Field(lambda: StepType)
    to_step = graphene.Field(lambda: StepType)

    class Meta:
        model = Transitions
        exclude = ("step_instances_set","instance_logs_set")  # or leave empty if none


class WorkflowType(DjangoObjectType):
    steps = graphene.List(StepType)
    transitions = graphene.List(TransitionType)

    class Meta:
        model = Workflows
        exclude = ("tickets_set", "steps_set", "instance_logs_set")  # assuming reverse relations

    def resolve_steps(self, info):
        return Steps.objects.filter(workflow=self.workflow_id)

    def resolve_transitions(self, info):
        step_ids = Steps.objects.filter(workflow=self.workflow_id).values_list("step_id", flat=True)
        return Transitions.objects.filter(
            Q(from_step__step_id__in=step_ids) |
            Q(to_step__step_id__in=step_ids)
        ).distinct()
