import graphene
import posts.schema
import workflow.graphql.queries as workflow_queries
import instances.graphql.queries as instance_queries
import tickets.graphql.queries as ticket_queries
import workflow.graphql.mutations as workflow_mutations


class Query(
    # posts.schema.Query,
    workflow_queries.Query, 
    instance_queries.Query,
    ticket_queries.Query,
    graphene.ObjectType):
    pass

class Mutation(
    # posts.schema.Mutation,
    workflow_mutations.Mutation, 
    graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
