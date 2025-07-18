import graphene
from graphene_django import DjangoObjectType
from tickets.models import Tickets

class ticketType(DjangoObjectType):
    class Meta:
        model = Tickets
        # fields = "__all__"
        exclude = (
            'step_instances_set',
            'workflow')