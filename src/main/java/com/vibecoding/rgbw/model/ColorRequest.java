package com.vibecoding.rgbw.model;

public record ColorRequest(int r, int g, int b, int w) {
    public boolean isValid() {
        return inRange(r) && inRange(g) && inRange(b) && inRange(w);
    }
    private static boolean inRange(int v) {
        return v >= 0 && v <= 255;
    }
}