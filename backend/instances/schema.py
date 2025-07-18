import graphene
from .graphql.queries import Query as AppQuery
from .graphql.mutations import Mutation as AppMutation

class Query(AppQuery, graphene.ObjectType):
    pass

class Mutation(AppMutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
