from requests import get, post
import time
import json
import cv2
import numpy as np

def get_fr_response(data_bytes, file_type='image/jpg'):

    # endpoint = r"https://nachextraction.cognitiveservices.azure.com/"
    # Subscription Key
    # "5110a53dba7043d3af20b15e4778eafd"
    apim_key = "1bd05a4106504a798f862fa46799d5b9"
    # Model ID
    model_id = "QR_NACH_template_2"  # "062b4637-fef9-4cf0-ab98-823e7029a113"
    # API version
    API_version = "2022-01-30-preview"  # "v2.1-preview.3"
    region = "centralindia"
    # post_url = endpoint + "/formrecognizer/%s/custom/models/%s/analyze" % (API_version, model_id)
    params = {
        "includeTextDetails": True
    }

    headers = {
        # Request headers
        'Content-Type': file_type,
        'Ocp-Apim-Subscription-Key': apim_key,
    }
    try:
        data_bytes = data_bytes
    except IOError:
        print("Inputfile not accessible.")
    url = f"https://{region}.api.cognitive.microsoft.com/formrecognizer/documentModels/{model_id}:analyze?api-version={API_version}"
    # url = f"https://centralindia.api.cognitive.microsoft.com/formrecognizer/documentModels/{model_id}:analyze?api-version=2022-01-30-preview"
    n_tries = 10
    n_try = 0
    wait_sec = 5
    max_wait_sec = 60

    while n_try < n_tries:
        try:
            print('Initiating analysis...')
            resp = post(url=url, data=data_bytes,
                        headers=headers, params=params)
            if resp.status_code != 202:
                print("POST analyze failed:Couldn't Connect to Azure \n")
            print("POST analyze succeeded:\n")
            get_url = resp.headers["operation-location"]
            break
        except Exception as e:
            print("POST analyze failed:Couldn't Connect to Azure Exception\n")
            n_try += 1
            time.sleep(wait_sec)
    print('Getting analysis results...')
    while n_try < n_tries:
        try:
            resp = get(url=get_url, headers={
                       "Ocp-Apim-Subscription-Key": apim_key})
            resp_json = resp.json()
            if resp.status_code != 200:
                print("GET analyze results failed:\n%s" %
                      json.dumps(resp_json))
                return json.dumps({'Message': 'Unable to process', 'Error': resp_json})
            status = resp_json["status"]
            if status == "succeeded":
                # % json.dumps(resp_json, indent=2, sort_keys=True))
                print("Analysis succeeded:\n")
                result = {}
                for  i in resp_json['analyzeResult']['documents'][0]['fields'].keys():
                    try:
                        result[i]= resp_json['analyzeResult']['documents'][0]['fields'][i]['content']
                    except:
                        result[i]=None
                return result
                
            if status == "failed":
                print("Analysis failed:\n%s" % json.dumps(resp_json))
                return json.dumps({'Message': 'Unable to process', 'Error': resp_json})
            # Analysis still running. Wait and retry.
            time.sleep(wait_sec)
            n_try += 1
            wait_sec = min(2*wait_sec, max_wait_sec)
        except Exception as e:
            msg = "GET analyze results failed:\n%s" % str(e)
            return json.dumps({'Message': 'Unable to process', 'Error': msg})
    print("Analyze operation did not complete within the allocated time.")

    return "done!"


def detect_blur(img_str):
    nparr = np.fromstring(img_str, np.uint8)
    img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR) #cv2.CV_LOAD_IMAGE_COLOR # cv2.IMREAD_COLOR in OpenCV 3.1# CV
    input_image = img_np#cv2.imread(img_file_path, 0)
    grayscale_image = cv2.cvtColor(input_image, cv2.COLOR_BGR2GRAY)
    laplacian_var_original = cv2.Laplacian(input_image, ddepth = cv2.CV_64F).var()  
    laplacian_var_grayscale = cv2.Laplacian(grayscale_image, ddepth = cv2.CV_64F).var()
    print("original:",laplacian_var_original,'Grayscale:',laplacian_var_grayscale)
    
    if laplacian_var_grayscale < 1300:
        return False      
    else:
        return True


def make_grayscale(in_stream):
    #use numpy to construct an array from the bytes
    arr = np.fromstring(in_stream, dtype='uint8')
    #decode the array into an image
    img = cv2.imdecode(arr, cv2.IMREAD_UNCHANGED)
    # Make grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    out_stream = cv2.imencode('.jpeg', gray)[1].tostring()
    return out_stream