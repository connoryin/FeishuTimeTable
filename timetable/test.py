import requests
from multiprocessing import Process, Manager
import threading

class req (threading.Thread):
    def __init__(self, args):
        threading.Thread.__init__(self)
        self.queue = args[0]

    def run(self):
        try:
            r = requests.get('http://47.100.108.13:3620/course/2/')
            self.queue.append(r.elapsed)
        except Exception as e:
            print('error: ', e)

if __name__ == "__main__":
    with Manager() as manager:
        q = manager.list()
        threads = []
        for _ in range(1000):
            thread = req(args=(q,))
            threads.append(thread)
        for t in threads:
            t.start()
        for t in threads:
            t.join()
        print(max(q))
