By now you already have a user account. Your user account identifies you to the web applications you interact with. A username and password is sufficient for interacting with an application because the application has a user interface, so it knows that the authenticated user is the same one interacting with it. The Agave API does not have a user interface, so simply providing it a username and password is not sufficient. Agave needs to know both the user on whose behalf it is acting as well as the client application that is making the call. Whereas every person has a single user account, they may leverage multiple services to do their daily work. They may start out using the <a href="https://de.iplantcollaborative.org" title="iPlant Discovery Environment" target="_blank">Discovery Environment</a> to kick of an analysis, then switch to <a href="https://my-plant.org/" title="MyPlant" target="_blank">MyPlant</a> to discuss some results, then receive an email that new data has been shared with them, click a <a href="http://agaveapi.co/pre-authenticated-url-shortening-with-postits/" title="Pre-Authenticated URL Shortening with PostIts">PostIt</a> link that allows them to download the data directly to their desktop, edit the file locally, and save it in a local folder that syncs with their iPlant <a href="http://www.iplantcollaborative.org/discover/data-store" title="iPlant Data Store" target="_blank">cloud storage</a> in the background.

In each of the above interactions, the user is the same, but the context with which they interact with the Agave is different. Further, the above interactions all involved client applications developed by the same organization. The situation is further complicated when one or more 3rd party client applications are used to leverage the infrastructure. Agave needs to track both the users and client applications with whom it interacts. It does this through the issuance of API keys.

Agave uses <a href="http://oauth.net/2" title="OAuth2" target="_blank">OAuth2</a> to authenticate users and make authorization decisions about what APIs client applications have permission to access. A discussion of OAuth2 is out of the context of this tutorial. You can read more about it on the <a href="http://oauth.net/2" title="OAuth2" target="_blank">OAuth2</a> website or from the websites of any of the many other service providers using it today. In this section, we will walk you through getting your API keys so we can stay focused on learning how to interact with the Agave's APIs.

## Creating a new client application  

In order to interact with any of the Agave APIs, you will need to first get a set of API keys. You can get your API keys from the <a href="http://agaveapi.co/live-docs/#!/clients/create_post_1" title="Clients API">Clients service</a>. The example below shows how to get your API keys using both curl and the <a href="http://agaveapi.co/agave-cli/" title="Agave CLI">Agave CLI</a>.

```shell
curl -sku "$API_USERNAME:$API_PASSWORD" -X POST -d "client_name=my_cli_app" -d "description=Client app used for scripting up cool stuff" https://$API_BASE_URL/clients/$API_VERSION
```

```plaintext
clients-create -S -v -N my_cli_app -D "Client app used for scripting up cool stuff"
```
    Note: the -S option will store the new API keys for future use so you don't need to manually enter then when you authenticate later.


The response to this call for our example user looks like this:

```javascript
{  
   "callbackUrl":"",
   "key":"gTgp...SV8a",
   "secret":"hZ_z3f...BOD6",
   "description":"Client app used for scripting up cool stuff",
   "name":"my_cli_app",
   "tier":"Unlimited",
   "_links":{  
      "self":{  
         "href":"https://$API_BASE_URL/clients/$API_VERSION/my_cli_app"
      },
      "subscriber":{  
         "href":"https://$API_BASE_URLprofiles/$API_VERSION/nryan"
      },
      "subscriptions":{  
         "href":"https://$API_BASE_URL/clients/$API_VERSION/my_cli_app/subscriptions/"
      }
   }
}
```

Your API keys should be kept in a secure place and not shared with others. This will prevent other, unauthorized client applications from impersonating your application. If you are developing a web application, you should also provide a valid callbackUrl when creating your keys. This will reduce the risk of your keys being reused even if they are compromised. You should also create a unique set of API keys for each client application you develop. This will allow you to better monitor your usage on a client application-to-application basis and reduce the possibility of inadvertently hitting usage quotas due to cumulative usage across client applications.

## Listing your existing client applications  

Over time you may develop several client applications. Managing several sets of API keys can become tricky. You can see which applications you have created by querying the Clients service.

```shell
curl -sku "$API_USERNAME:$API_PASSWORD" https://$API_BASE_URL/clients/$API_VERSION
```

```plaintexti
clients-list -v
```

The response to this call for our example user looks like this:

```javascript
[  
   {  
      "callbackUrl":"",
      "key":"xn8b...0y3d",
      "description":"",
      "name":"DefaultApplication",
      "tier":"Unlimited",
      "_links":{  
         "self":{  
            "href":"https://$API_BASE_URL/clients/$API_VERSION/DefaultApplication"
         },
         "subscriber":{  
            "href":"https://$API_BASE_URLprofiles/$API_VERSION/nryan"
         },
         "subscriptions":{  
            "href":"https://$API_BASE_URL/clients/$API_VERSION/DefaultApplication/subscriptions/"
         }
      }
   },
   {  
      "callbackUrl":"",
      "key":"gTgp...SV8a",
      "description":"Client app used for scripting up cool stuff",
      "name":"my_cli_app",
      "tier":"Unlimited",
      "_links":{  
         "self":{  
            "href":"https://$API_BASE_URL/clients/$API_VERSION/my_cli_app"
         },
         "subscriber":{  
            "href":"https://$API_BASE_URLprofiles/$API_VERSION/nryan"
         },
         "subscriptions":{  
            "href":"https://$API_BASE_URL/clients/$API_VERSION/my_cli_app/subscriptions/"
         }
      }
   }
]
```

<aside class="notice">In the last response you will notice that the client secret was not returned as part of the response objects. If you need to recover your client secret, just recreate the client app. Your client keys will not change, but the response will include your secret key.</aside>

### Deleting client registrations  

At some point you may need to delete a client. You can do this by requesting a DELETE on your client in the Clients service.

```shell
curl -sku "$API_USERNAME:$API_PASSWORD" -X DELETE https://$API_BASE_URL/clients/$API_VERSION/my_cli_app
```

```plaintexti
clients-delete -v my_cli_app
```


The response to this call is simply a null result object.

### Managing API subscriptions  

When you register a new client application and get your API keys, you are given access to all the Agave APIs by default. You can see the APIs you have access to by querying the subscriptions collection of your client.

```shell
curl -sku "$API_USERNAME:$API_PASSWORD" https://$API_BASE_URL/clients/$API_VERSION/my_cli_app/subscriptions
```

```plaintexti
clients-subscriptions-list -v my_cli_app
```


The response to this call for our example client looks like this:

```javascript
[
  {
     "context":"/apps",
     "name":"Apps",
     "provider":"admin",
     "status":"PUBLISHED",
     "version":"v2",
     "tier":"Unlimited",
     "_links":{
        "api":{
           "href":"https://public.agaveapi.co/apps/v2/"
        },
        "client":{
           "href":"https://public.agaveapi.co/clients/v2/systest_test_client"
        },
        "self":{
           "href":"https://public.agaveapi.co/clients/v2/systest_test_client/subscriptions/"
        }
     }   
  },
  {
     "context":"/files",
     "name":"Files",
     "provider":"admin",
     "status":"PUBLISHED",
     "version":"v2",
     "tier":"Unlimited"
     "_links":{
        "api":{
           "href":"https://public.agaveapi.co/files/v2/"
        },
        "client":{
           "href":"https://public.agaveapi.co/clients/v2/systest_test_client"
        },
        "self":{
           "href":"https://public.agaveapi.co/clients/v2/systest_test_client/subscriptions/"
        }
     }
  },
  ...
]
```

Over time, new APIs will be deployed. When this happens you will need to subscribe to the new APIs. You can do this by POSTing a request to the subscription collection with the information about the new API.

```shell
curl -sku "$API_USERNAME:$API_PASSWORD" -X POST -d "name=transforms" https://$API_BASE_URL/clients/$API_VERSION/my_cli_app/subscriptions
```

```plaintexti
clients-subscriptions-update -v -N transforms my_cli_app
```


The response to this call will be a JSON array identical to the one returned when listing your subscriptions. You could repeat this step for each new API, or you could use the wildcard API name, *, to resubscribe to all active APIs.

```shell
curl -sku "$API_USERNAME:$API_PASSWORD" -X POST -d "name=*" https://$API_BASE_URL/clients/$API_VERSION/my_cli_app/subscriptions
```

```plaintexti
clients-subscriptions-update -v -N * my_cli_app
```

Again, the response will be identical to the previous one.