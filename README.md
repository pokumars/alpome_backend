# ALPOME 
This is the backend of alpome plant monitoring application. Part of an app done as part of an innovation course.

Final product: https://alpome.herokuapp.com/ 

Frontend can be found at https://github.com/AnnaA123/alpome_frontend

### credentials to test the app
name of the user-main 

pass of the user- jonSnow

## Backend Code

### What is alpome
**NB: any mention of unit, garden or plant refer to basically whatever it is that the user wants to monitor with the application.**

Alpome is an application for users to monitor their plants and gardens. They can use it to upload images of 
the plant or garden in order to track its progress over time. User can also make notes on the unit and put in how frequently they want to water the plant.


 The original idea was for a Supragarden hydroponic unit. For that specific hydroponic unit, there is a special account. in that account, a user can see the current state of the unit due to some sensors placed in the hydroponic unit. that specific account has the data such as Temperature, TVOC, Electrical Conductivity, co2, pH, Humidity, Water Temperature and Light.
Since that is a special account, I will give the credentials in order for you to login and expreience this specific unit


the controllers directory contains the logic for a set of endpoints
so www.url/api/users is in controllers/users.js anything that falls under
www.url/api/users is in that folder
## Technical

### Technologies used
- AWS S3
- AWS sdk
- Node
- Express
- MongoDB
- mongoose
- jsonwebtokens
- Jest
- Supertest
- cross-env

<h1  >API Documentation</h1>
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
      <td>none</td>
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
      <td>
        urlParam id of type int. </br>
        'headers': { 'Authorization': 'bearer eyR3st0fT0k3n....'}
      </td>
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
      <td>not added yet</td>
      <td>returns the new the new object </td>
      <td>- urlParam id of type int</br>
      - send user token in the header like this</br>      
      'headers': { 'Authorization': 'bearer eyR3st0fT0k3n....'}
      </td>
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
    <td>it is an array of growing units... </br>refer to the response of GET a single growing unit</td>
    <td>- send user token in the header like this</br>'headers': { 'Authorization': 'bearer eyR3st0fT0k3n....'}</td>
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
    "last_watered": 1606319784599,</br>
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
    <td>- urlParam id of type int </br>
    - send user token in the header like this
    </br>'headers': { 'Authorization': 'bearer eyR3st0fT0k3n....'}
    </td>
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
    "last_watered": 1606319784599,</br>
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
    <td>update a growing unit</td>
    <td>it will return the object with the applied updates</td>
    <td>required- urlParam id of type int <br>
      - send user token in the header like this
      </br>'headers': { 'Authorization': 'bearer eyR3st0fT0k3n....'}
      required-You also need to pass the updated growing unit as the request body. <br>
      If the field to update is an array,please fill the array with the old stuff and add the newer stuff so that the array you send to the backend represents the update you want. The only exception is adding a new image to the a growing unit; for that, I will make a url specifically for that
    </td>
  </tr>
    
  <tr>
    <td>POST</td>
    <td>/api/growing_unit/unitimage/:id</td>
    <td>add an image to a growing unit</td>
    <td>It will return the growing unit object updated with the new image in the images array</td>
    <td>- required- urlParam id of the growing unit you want to add the image to <br>
      - send user token in the header like this
      </br>'headers': { 'Authorization': 'bearer eyR3st0fT0k3n....'}
      - required- image (obviously)
    </td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>/api/growing_unit/unitimage/:id</td>
    <td>delete an image from a growing unit</td>
    <td>It will return the growing unit object updated absent the deleted image in the images array</td>
    <td>required- urlParam id of the growing unit you want to add the image to <br>
      - send user token in the header like this
      </br>'headers': { 'Authorization': 'bearer eyR3st0fT0k3n....'}
      required- filename {"fileName": "example123.jpg"}<br>
    </td>
  </tr>
  
</table>



User token should be added in headers like so 
'headers': { 'Authorization': 'bearer eyR3st0fT0k3n....'}
