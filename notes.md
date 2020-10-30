//we will need to serve users
//we will need to serve growing units/plants
  //images, the users who have access


  ### Endpoints for the Frontend to get info

  endpoint, verb, params, info, response
  GET all users
  GET 1 user
  DELETE user


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
        "id": 1,</br>
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
        "id": 1,</br>
        "name": "Leanne Graham",</br>
        "username": "Bret",</br>
        "email": "Sincere@april.biz"</br>
    }</code> </td>
    <td>urlParam id of type int</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>/api/users/</td>
    <td>add a new user</td>
    <td><code>{
        "id": 1,</br>
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
    <td>add a new growing unit</td>
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