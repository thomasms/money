

with open('data.txt', 'r') as f:
    count = 1
    for l in f:
        a = l.split()
        bt = float(a[0].replace(",", ""))
        at = float(a[1].replace(",", ""))

        strg = "{name: '" + str(count) + "%', bt : " + str(bt) + ", at: " + str(at) + "},"
        count += 1
        print(strg)
