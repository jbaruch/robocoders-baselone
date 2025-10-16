package com.vibecoding.rgbw.model;

public record ColorResponse(String status, int r, int g, int b, int w, String message) {
    public static ColorResponse ok(int r, int g, int b, int w, String message) {
        return new ColorResponse("ok", r, g, b, w, message);
    }
    public static ColorResponse error(String message, int r, int g, int b, int w) {
        return new ColorResponse("error", r, g, b, w, message);
    }
}