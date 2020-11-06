const { deleteGrowingUnitImagesFromS3 } = require("./utils/imageHandler");


const mega =[
  [
    {
      _id: "5fa59707a3860c68ece7eb8d",
      fileName: 'd0fa0d67-cd05-48a9-a7bd-e52c2ec3b73b.png',
      Key: 'd0fa0d67-cd05-48a9-a7bd-e52c2ec3b73b.png',
      image_url: 'https://ohe-test-image-upload-1.s3.amazonaws.com/d0fa0d67-cd05-48a9-a7bd-e52c2ec3b73b.png',
      date_uploaded: "2020-11-06T18:33:43.767Z"
    }
  ],
  [
    {
      _id: "5fa5979c5f3e7a5620657ed2",
      fileName: '30459082-521f-4d97-bdfe-8f88a2f15adf.png',
      Key: '30459082-521f-4d97-bdfe-8f88a2f15adf.png',
      image_url: 'https://ohe-test-image-upload-1.s3.amazonaws.com/30459082-521f-4d97-bdfe-8f88a2f15adf.png',
      date_uploaded: "2020-11-06T18:36:12.171Z"
    }
  ],
  [
    {
      _id: "5fa598135f3e7a5620657ed4",
      fileName: '6b0353cd-d543-4706-bb05-55de6a4c830a.png',
      Key: '6b0353cd-d543-4706-bb05-55de6a4c830a.png',
      image_url: 'https://ohe-test-image-upload-1.s3.eu-central-1.amazonaws.com/6b0353cd-d543-4706-bb05-55de6a4c830a.png',   
      date_uploaded: "2020-11-06T18:38:11.804Z"
    }
  ]
];

const test = Object.assign({}, {jj: 55});
//console.log(test);

const map1 = mega.map(x => Object.assign({}, {Key: x}));

console.log(map1);


deleteGrowingUnitImagesFromS3(arr, null, null);