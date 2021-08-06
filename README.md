# rPPG Project

## Project Setup
1. Install necessary packages using `npm init` in root directory
2. Run server on port 80 using `node app.js` command in root directory
3. Call 1st api request to store and process video in formdata format (given below)
4. Call 2nd api to get heart rate after some time.

## API 1: UPLOAD VIDEO TO SERVER

#### Description
Sends recorded video from app to server for calculating BPM

#### Api endpoint
/upload/video

#### Parameters
Formdata format

Key: inputVideo

Value: input video recorded from app

#### Response
Json format
	
##### Case 1
Invalid data

opt: { 'success': false, 'msg': error_msg }

No form data present with required key

##### Case 2
Invalid data

opt: { 'success': false, 'msg': ‘No File Selected!’}

No file input in form data

##### Case 3
Video with required key sent

opt: { 'success': true, 'msg': 'File uploaded. Processing video... Please recheck on session id after few minutes', content: “unique_id” }

File successfully uploaded and calculating bpm for video 

## API 2 CALCULATE BPM FOR VIDEO

#### Description
Sends calculated bpm for a video based on session id

#### Api endpoint
 /calculate/bpm

#### Parameters
Json format

input: { “sessionId”: “unique_key” }

“unique_key”: the key received using “UPLOAD VIDEO TO SERVER” api response

#### Response
Json format
	
##### Case 1
input: {‘sessionId’: ‘unique_id’}

opt: { 'success': false, 'msg': 'Processing... Please wait' }

Bpm is still being calculated by API, please wait and call endpoint again after some time

##### Case 2
input: {‘sessionId’: ‘unique_id’}

opt: { 'success': true, 'msg': 'Result processed', content: ‘array_containing_bpm_values’ }

Bpm successfully calculated
