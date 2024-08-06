## Creating Users, Logging In, and Adding Blogs with REST API Using PowerShell ##

**Creating a user:**

- `$body = '{"username":"hellas", "name":"Arto Hellas", "password":"password"}'`
- `$headers = @{"Content-Type"="application/json"}`
- `$response = Invoke-RestMethod -Uri http://localhost:3003/api/users -Method Post -Headers $headers -Body $body`
- `$response`

**User login and receive token:**

- `$body = '{"username":"hellas", "password":"password"}'`
- `$headers = @{"Content-Type"="application/json"}`
- `$response = Invoke-RestMethod -Uri http://localhost:3003/api/users/login -Method Post -Headers $headers -Body $body`
- `$response`
- `$token = $response.token`
- `$token`

**Adding a blog with token:**

- `$headers = @{"Content-Type"="application/json"; "Authorization"="Bearer $token"}`
- `$body = '{"title":"New Blog", "author":"New Author", "url":"http://newurl.com", "likes":10}'`
- `$response = Invoke-RestMethod -Uri http://localhost:3003/api/blogs -Method Post -Headers $headers -Body $body`
- `$response`

