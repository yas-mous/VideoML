import sys

if len(sys.argv) < 3:
    print("Usage: python script.py <arg1> <arg2>")
    sys.exit(1)

arg1 = sys.argv[1]
arg2 = sys.argv[2]

# Simuler un traitement, par exemple concaténer les arguments
result = f"Processed: {arg1} {arg2}"

print(result)  # La sortie sera capturée par le processus Node.js
