# imports
import sys
import redis
from pyVHR.signals.video import Video
from pyVHR.methods.ssr import SSR

# connect to redis
r = redis.Redis(host='localhost', port=6379, db=0)

# process video
videoFilename = sys.argv[2]
Video.loadCropFaces = Video.saveCropFaces = False
video = Video(videoFilename)
video.getCroppedFaces(detector='mtcnn', extractor='opencv')
video.printVideoInfo()
params = {"video": video, "verb":0, "ROImask":"skin_adapt", "skinAdapt":0.2}
ssr = SSR(**params)
bpmES_ssr, timesES_ssr = ssr.runOffline(**params)

# append to result list
li = []
for x in bpmES_ssr:
  li.append(x)

# write into redis
r.set(sys.argv[1], str(li))
print('calulated heart rate', str(li))
sys.stdout.flush()

