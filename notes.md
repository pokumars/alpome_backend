
<link rel="stylesheet" type="text/css" media="all" href="notes.css" />
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

<h2  >Login</h2>
<h3>/api/growing_unit</h3>

<table id="my-table">
  <tr>
    <th>Verb</th>
    <th>Endpoint</th>
    <th>Info</th>
    <th>Example Response</th>
    <th>Params</th>
  </tr>
  <tr>
    <td>POST</td>
    <td>/api/login</td>
    <td>log existing user in</td>
    <td> 
      <code>{</br>
            "token":</br> "eyJhbGciOiJIUzI1NiIsI </br>
            "user": {</br>
                "own_units": [</br>
                    "5fa04b8b5f19c60974e9926d",</br>
                    "5fa04c5561f1523d2877b498",</br>
                ],</br>
                "units_with_access": [],</br>
                "email": "testUser3@testme.com",</br>
                "username": "testUser3",</br>
                "user_id": "5fa018f47400402da4bc9fae"</br>
            }}</br>
        </code>
    </td>
    <td><code>{</br>
      "username": "testUser3",</br>
      "password": "somePassword"</br>
      }</code>
    </td>
  </tr>
</table>

<h2>Users</h2>
<h3>/api/users</h3>

 <table id="my-table">
    <tr>
      <th>Verb</th>
      <th>Endpoint</th>
      <th>Info</th>
      <th>Example Response</th>
      <th>Request Params</th>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/users</td>
      <td>get all users</td>
      <td>[</br>userObj, </br>
        <code>{
              "user_id": 1,</br>
              "name": "Leanne Graham",</br>
              "username": "Bret",</br>
              "email": "Sincere@april.biz"</br>
          }
        </code>,</br> userObj,</br> ......</br>]</td>
      <td>TODO</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/api/users/:id</td>
      <td>get a user of the id</td>
      <td>
        <code>{
          "user_id": 1,</br>
          "name": "Leanne Graham",</br>
          "username": "Bret",</br>
          "email": "Sincere@april.biz"</br>
      }
    </code> </td>
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
      <td>
        <code>{</br>
          "own_units": [],</br>
          "units_with_access": [],</br>
          "email": "testUser2@testme.com",</br>
          "username": "testUser2",</br>
          "user_id": "5fabcbb640abcf3cf0956f31"</br>
      }</code> </td>
      <td>
        When you create user, send this type of object</br>
        <code>
          {</br>
          "username": "testUser2",</br>
          "password": "jonSnow",</br>
          "email": "testUser2@testme.com"</br>
          }</br>
        </code></td>
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

<table id="my-table">
  <tr>
    <th>Verb</th>
    <th>Endpoint</th>
    <th>Info</th>
    <th>Example Response</th>
    <th>request Params</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>/api/growing_unit</td>
    <td>get all growing units</td>
    <td>TODO - it is an array of growing units... refer to the response of GET a single frowing unit</td>
    <td>send user token in the header</td>
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
    }</code> </br>
    If there is an error in saving it will come back with status of 4hundred and something and the error object</td>
    <td>required- send user token in the header <br></td>
  </tr>
    <tr>
    <td>PUT</td>
    <td>/api/growing_unit/:id</td>
    <td>update a growing unit TODO : not added yet</td>
    <td>TODO : the new object - it will return the object with the applied updates</td>
    <td>required- urlParam id of type int <br>
      required- send user token in the header <br>
      required-You also need to pass the updated growing unit as the request body. <br>
      If the field to update is an array,please fill the array withthe old stuff and add the newer stuff so that the array you send to the backend represents the update you want. The only exception is adding a new image to the a growing unit; for that, I will make a url specifically for that
    </td>
  </tr>
    
  <tr>
    <td>POST</td>
    <td>/api/growing_unit/unitimage/:id</td>
    <td>add an image to a growing unit</td>
    <td>It will return the growing unit object updated with the new image in the images array</td>
    <td>required- urlParam id of the growing unit you want to add the image to <br>
      required- send user token in the header.<br>
      required- image (obviously)
    </td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/api/growing_unit/unitimage/:id</td>
    <td>delete an image from a growing unit</td>
    <td>It will return the growing unit object updated absent the deleted image in the images array</td>
    <td>required- urlParam id of the growing unit you want to add the image to <br>
      required- send user token in the header.<br>
      required- filename {"fileName": "example123.jpg"}<br>
    </td>
  </tr>
  
</table>

TODO:
1. when registering, the username must be unique. So whilst the user types, you can make a request to api/register/is_name_free and I will send back a true or false (or smth else; I will figure it out later).

2. When a user logs in they will get a token that they will need every time they make some request. It verifies
that they are themselves and they are logged in. I dont have it yet setup so dont worry about it until I do. When I do, all you have to is save it on the pc and then attach it to the request headers (or smth like that).

User token should be added in headers like so 
'headers': { 'Authorization': 'bearer ey....'}