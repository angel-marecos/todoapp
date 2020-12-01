import graphene
import apps.tasks.schema
import apps.users.schema
import graphql_jwt


class Query(apps.users.schema.Query, apps.tasks.schema.Query, graphene.ObjectType):
    pass


class Mutation(apps.users.schema.Mutation, apps.tasks.schema.Mutation, graphene.ObjectType):
    token_auth = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)
