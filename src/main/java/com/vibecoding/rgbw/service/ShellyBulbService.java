package com.vibecoding.rgbw.service;

import com.vibecoding.rgbw.model.ColorRequest;
import com.vibecoding.rgbw.model.ColorResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class ShellyBulbService {

    private final String shellyIp;
    private final RestClient http;

    public ShellyBulbService(@Value("${shelly.ip:}") String shellyIp, RestClient.Builder restClientBuilder) {
        this.shellyIp = shellyIp == null ? "" : shellyIp.trim();
        this.http = restClientBuilder.build();
    }

    public boolean isConfigured() {
        return shellyIp != null && !shellyIp.isBlank();
    }

    public ColorResponse setColor(ColorRequest req) {
        int r = clamp(req.r()), g = clamp(req.g()), b = clamp(req.b()), w = clamp(req.w());
        boolean off = (r == 0 && g == 0 && b == 0 && w == 0);
        var uriBuilder = UriComponentsBuilder
                .fromHttpUrl("http://" + shellyIp + "/color/0"); // Gen1 color endpoint
        if (off) {
            uriBuilder.queryParam("turn", "off");
        } else {
            uriBuilder.queryParam("turn", "on")
                    .queryParam("red", r)
                    .queryParam("green", g)
                    .queryParam("blue", b)
                    .queryParam("white", w)
                    .queryParam("gain", 100); // 0..100, keep simple per demo
        }
        var uri = uriBuilder.build(true).toUri();
        try {
            var response = http.get().uri(uri).retrieve().toEntity(String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                return ColorResponse.ok(r, g, b, w, "Shelly Gen1 applied via GET " + uri);
            }
            return ColorResponse.error("Shelly responded with status " + response.getStatusCode(), r, g, b, w);
        } catch (Exception e) {
            return ColorResponse.error("Shelly request failed: " + e.getMessage(), r, g, b, w);
        }
    }

    private int clamp(int v) {
        return Math.max(0, Math.min(255, v));
    }
}
