import graphene
from tickets.models import Tickets
from tickets.graphql.types import ticketType

class Query(graphene.ObjectType):
    tickets = graphene.List(ticketType)

    def resolve_tickets(root, info):
        return Tickets.objects.all()
    