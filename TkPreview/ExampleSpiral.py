import time
w = open("/tmp/tmp_pipe", 'w')

x, y, z = 0, 19, 0
for i in range(20):
    z += 1
    for j in range(4):
        for k in range(19):
            #print("i: {0}, j: {1}, k: {2}".format(i, j, k))
            #print("x: {0}, y: {1}, z: {2}".format(x, y, z))
            if (j == 0):
                x += 1
            elif (j == 1):
                y -= 1
            elif (j == 2):
                x -= 1
            elif (j == 3):
                y += 1
            sx = str(x) if (x > 9) else "0"+str(x)
            sy = str(y) if (y > 9) else "0"+str(y)
            sz = str(z) if (z > 9) else "0"+str(z)

            w.write("{0} {1} {2}".format(sx, sy, sz))
            #time.sleep(0.2)

w.flush()
input("Done; Type anything to quit... ")
w.write("qqqqqqqq")
