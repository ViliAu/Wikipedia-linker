import requests

ADDRESS = 'http://127.0.0.1'
PORT = '3000'

def start_client_loop():
    while True:
        article_from = input("Give a wikipedia article to start looking from (Leave empty to quit): ")
        if (len(article_from) == 0):
            break
        article_to = input("Give a wikipedia article where you want to end: ")
        if (len(article_to) == 0):
            break
        if (len(article_from) > 0 and len(article_to) > 0):
            search = f'{ADDRESS}:{PORT}/search?from={article_from}&to={article_to}'
            try:
                print(f"Trying to find a path from {article_from} to {article_to}...\n")
                response = requests.get(search)
                res = response.json()
                if(res['success'] == True):
                    print(f"Found a path! Last node is {res['final']} in {res['time']} seconds.")
                else:
                    print(f"Couldn't find a path between {article_from} and {article_to}.")
                print("\n")
            except KeyboardInterrupt:
                break
            except:
                print("An error has occurred!")
if __name__ == '__main__':
    start_client_loop()