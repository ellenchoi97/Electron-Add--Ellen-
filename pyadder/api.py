import sys, zerorpc

'''
The class with the add function that is 
called from the Electron application
'''
class Adder(object):
    def add(self, x, y):
        try:
            return float(x) + float(y)
        except Exception as e:
            return 0.0

def parse_port():
    #Default port number
    port = 4242

    '''
    #If a port was passed as an argument, 
    #set that value as the port
    '''
    try:
        port = int(sys.argv[1])
    except Exception as e:
        pass

    return port

#The function to build the ZeroMQ server
def main():
    addr = 'tcp://127.0.0.1:' + str(parse_port())
    s = zerorpc.Server(Adder())
    s.bind(addr)
    s.run()

if __name__ == '__main__':
    main()

