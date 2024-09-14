import inspect
import importlib

test_code = importlib.import_module("test_code")

fn_names = []
for fn in dir(test_code):
    if fn[:2] != "__":
        fn_names.append(fn)

getattr(test_code, fn_names[0])()

