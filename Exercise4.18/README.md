## Creating Users, Logging In, and Adding Blogs with REST API Using PowerShell ##

**_Creating a user:**_
`$body = '{"username":"hellas", "name":"Arto Hellas", "password":"password"}'`
`$headers = @{"Content-Type"="application/json"}`
`$response = Invoke-RestMethod -Uri http://localhost:3003/api/users -Method Post -Headers $headers -Body $body`
`$response`

**_User login and receive token:**_ 
`$body = '{"username":"hellas", "password":"password"}'`
`$headers = @{"Content-Type"="application/json"}`
`$response = Invoke-RestMethod -Uri http://localhost:3003/api/users/login -Method Post -Headers $headers -Body $body`
`$response`
`$token = $response.token`
`$token`

**_Adding a blog with token:**_
`$headers = @{"Content-Type"="application/json"; "Authorization"="Bearer $token"}`
`$body = '{"title":"New Blog", "author":"New Author", "url":"http://newurl.com", "likes":10}'`
`$response = Invoke-RestMethod -Uri http://localhost:3003/api/blogs -Method Post -Headers $headers -Body $body`
`$response`

