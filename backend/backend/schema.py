import graphene
import posts.schema
import workflow.graphql.queries as workflow_queries
import workflow.graphql.mutations as workflow_mutations

class Query(
    posts.schema.Query,
    workflow_queries.Query, 
    graphene.ObjectType):
    pass

class Mutation(
    posts.schema.Mutation,
    workflow_mutations.Mutation, 
    graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)
