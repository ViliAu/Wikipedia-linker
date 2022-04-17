import requests
import traceback

ADDRESS = 'http://127.0.0.1'
PORT = '3000'

def start_client_loop():
    while True:
        article_from = input("Give a wikipedia article to start looking from (Leave empty to quit): ")
        if (len(article_from) == 0):
            break
        article_to = input("Give a wikipedia article where you want to end: ")

        if (len(article_from) > 0 and len(article_to) > 0):
            search = f'{ADDRESS}:{PORT}/search?from={article_from}&to={article_to}'
            try:
                response = requests.get(search)
                res = response.json()
                #print("Found {res.}")
            except:
                print("An error has occurred!")
                traceback.print_exc()
if __name__ == '__main__':
    start_client_loop()