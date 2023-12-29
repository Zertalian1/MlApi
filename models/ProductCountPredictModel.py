from tensorflow import keras


class ProductCountPredictModel(keras.Model):
    def __init__(self):
        super().__init__()
        self.hidden1 = keras.layers.Dense(256, input_shape=(4,), activation='relu')
        self.hidden2 = keras.layers.Dense(192, activation='relu')
        self.hidden3 = keras.layers.Dense(128, activation='relu')
        self.hidden4 = keras.layers.Dense(64, activation='relu')
        self.out = keras.layers.Dense(4, activation='linear')

    def forward(self, x):
        x = self.hidden1(x)
        x = self.hidden2(x)
        x = self.hidden3(x)
        x = self.hidden4(x)
        x = self.out(x)
        return x
