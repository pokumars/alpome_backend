
# Notes for Frontend dev
//we will need to serve users
//we will need to serve growing units/plants
  //images, the users who have access

If you want to have access to this server while you work, you can do so by
- cloning this repo 
- npm install
- npm run watch

it will be served from http://localhost:3004/


These 2 will be most relevant to you </br>
http://localhost:3004/api/growing_unit/ </br>
http://localhost:3004/api/users

since http://localhost:3004/ wont be the final url, you may wanna save that as the baseUrl
and then when we have a proper url, we will just replace that in baseUrl.


If you want access to the database so you can play with the objects, ask me and I will give you access
You will have to sign up to mongodb so i can add you to the project

The passwords for everything is in a .env file. The server wont work until you have them.
Ask me for them

<h2>Users</h2>
<h3>/api/users</h3>

<table>

  <tr>
    <th>Verb</th>
    <th>Endpoint</th>
    <th>Info</th>
    <th>Example Response</th>
    <th>Params</th>
  </tr>

  <tr>
    <td>GET</td>
    <td>/api/users</td>
    <td>get all users</td>
    <td>[</br>userObj, </br> <code>{
        "user_id": 1,</br>
        "name": "Leanne Graham",</br>
        "username": "Bret",</br>
        "email": "Sincere@april.biz"</br>
    }</code>,</br> userObj,</br> ......</br>]</td>
    <td>TODO</td>
  </tr>

  <tr>
    <td>GET</td>
    <td>/api/users/:id</td>
    <td>get a user of the id</td>
     <td><code>{
        "user_id": 1,</br>
        "name": "Leanne Graham",</br>
        "username": "Bret",</br>
        "email": "Sincere@april.biz"</br>
    }</code> </td>
    <td>urlParam id of type int</td>
  </tr>

  <tr>
    <td>POST</td>
    <td>/api/users/</td>
    <td>add a new user</br>
    Take a look at userSchema in alpome_backend\models\user.js for more details
      <ul>
        <li>usernames must be unique in the system </li>
        <li>username is required</li>
        <li>minimum length is 4 characters; no whitespaces</li>
        <li></li>
      </ul>
    </td>
    <td><code>{
        "user_id": 1,</br>
        "name": "Leanne Graham",</br>
        "username": "Bret",</br>
        "email": "Sincere@april.biz"</br>
    }</code> </td>
    <td></td>
  </tr>

  <tr>
      <td>PUT</td>
      <td>/api/users/:id</td>
      <td>update a user TODO : not added yet</td>
      <td>TODO : the new object </td>
      <td>urlParam id of type int</td>
  </tr>
  
</table>


<h2>Growing Units</h2>
<h3>/api/growing_unit</h3>

<table>
  <tr>
    <th>Verb</th>
    <th>Endpoint</th>
    <th>Info</th>
    <th>Example Response</th>
    <th>Params</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>/api/growing_unit</td>
    <td>get all growing units</td>
    <td>TODO - it is an array of growing units... refer to the response of GET a single frowing unit</td>
    <td>TODO</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>/api/growing_unit/:id</td>
    <td>get a growing unit of the id</td>
     <td><code>{
       "common_names": [</br>
        "Christmas Tree"</br>
    ],</br>
    "shared_access": [],</br>
    "nickname": "Christmas Tree",</br>
    "location": "home",</br>
    "supragarden": false,</br>
    "last_watered": "2020-10-30T07:15:20.288Z",</br>
    "watering_frequency": 432000000,</br>
    "data_source": null,</br>
    "stream_url": "something.com",</br>
    "images": [</br>
        {</br>
            "_id": "5f9bbd88c6647153ec25826b",</br>
            "image_url": "https://ohe-test-image-upload-1.s3.eu-central-1.amazonaws.com/ad0fe675-905e-4881-8a88-5125be7b11ee.png",</br>
            "date_uploaded": "2020-10-30T07:15:20.288Z"</br>
        }</br>
    ],</br>
    "unit_id": "5f9bbd88c6647153ec25826a"</br>
    }</code></td>
    <td>urlParam id of type int</td>
  </tr>

  <tr>
    <td>POST</td>
    <td>/api/growing_unit/</td>
    <td>add a new growing unit </br>
    Take a look at growingUnitSchema in alpome_backend\models\growing_unit.js for more details</td>
    <td><code>{
       "common_names": [</br>
        "Christmas Tree"</br>
    ],</br>
    "shared_access": [],</br>
    "nickname": "Christmas Tree",</br>
    "location": "home",</br>
    "supragarden": false,</br>
    "last_watered": "2020-10-30T07:15:20.288Z",</br>
    "watering_frequency": 432000000,</br>
    "data_source": null,</br>
    "stream_url": "something.com",</br>
    "images": [</br>
        {</br>
            "_id": "5f9bbd88c6647153ec25826b",</br>
            "image_url": "https://ohe-test-image-upload-1.s3.eu-central-1.amazonaws.com/ad0fe675-905e-4881-8a88-5125be7b11ee.png",</br>
            "date_uploaded": "2020-10-30T07:15:20.288Z"</br>
        }</br>
    ],</br>
    "unit_id": "5f9bbd88c6647153ec25826a"</br>
    }</code> </td>
    <td></td>
  </tr>
    <tr>
    <td>PUT</td>
    <td>/api/growing_unit/:id</td>
    <td>update a growing unit TODO : not added yet</td>
    <td>TODO : the new object - it will return the object with the applied updates</td>
    <td>urlParam id of type int <br>
    You also need to pass the updated growing unit as the request body. or at least the fields to update</td>
  </tr>
  
</table>