import kirjava
client = kirjava.Client("http://localhost:5555/v1/graphql")
client.headers["x-hasura-admin-secret"] = "Zheli123"
 
query = """
  query getAddress {
                address {
                    access_key
                    account_id
                    id
                    dex
                }
            }
"""

res=client.execute(query)
print(res)

