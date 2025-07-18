import graphene
from graphene_django import DjangoObjectType
from instances.models import Step_Instances, Instance_Logs

class Step_InstancesType(DjangoObjectType):
    class Meta:
        model = Step_Instances
        exclude = (
            '',
            '')

class Instance_LogsType(DjangoObjectType):
    class Meta:
        model = Instance_Logs
        exclude = (
            'step_instance_id',
            '')