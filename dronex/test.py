from graphql_client import GraphQLClient

query = """
  subscription getAddress {
                address {
                    access_key
                    account_id
                    id
                    dex
                }
            }
"""

client = GraphQLClient('ws://localhost:5555/v1/graphql')
res = client.query(query,   headers={"x-hasura-admin-secret":"Zheli123"})
print(res)
client.close()