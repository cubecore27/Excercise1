import graphene
from instances.models import Step_Instances, Instance_Logs
from instances.graphql.types import Step_InstancesType, Instance_LogsType

class Query(graphene.ObjectType):
    step_instances = graphene.List(Step_InstancesType)
    instance_logs = graphene.List(Instance_LogsType)

    def resolve_step_instances(root, info):
        return Step_Instances.objects.all()
    
    def resolve_instance_logs(root, info):
        return Instance_Logs.objects.all()