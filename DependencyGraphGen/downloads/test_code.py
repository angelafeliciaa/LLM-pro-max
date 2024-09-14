def foo():
    print("a")

def bar():
    foo()

def bas():
    foo()

def boo():
    bar()

class OuterClass:
    def __init__(self, name):
        self.name = name
        self.inner_instance = self.InnerClass()  # Create an instance of the inner class

    def show(self):
        print(f"OuterClass name: {self.name}")
        self.inner_instance.display()

    class InnerClass:
        def __init__(self):
            self.value = "InnerClass value"

        def display(self):
            print(f"InnerClass value: {self.value}")

class WackyWizard:
    def __init__(self) -> None:
        pass

    def dance_on_the_moon(self):
        outer = OuterClass()
        outer.show()

    def juggle_pies():
        pass


class GoofyGiraffe:
    def __init__(self) -> None:
        OuterClass.InnerClass.display

    def moonwalk_on_mars(self):
        WackyWizard.juggle_pies()

    def toss_custard_pies(self):
        self.moonwalk_on_mars()
