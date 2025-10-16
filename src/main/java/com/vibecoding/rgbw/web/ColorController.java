package com.vibecoding.rgbw.web;

import com.vibecoding.rgbw.model.ColorRequest;
import com.vibecoding.rgbw.model.ColorResponse;
import com.vibecoding.rgbw.service.ShellyBulbService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ColorController {

    private final ShellyBulbService shelly;

    public ColorController(ShellyBulbService shelly) {
        this.shelly = shelly;
    }

    @PostMapping("/color")
    public ResponseEntity<ColorResponse> setColor(@RequestBody ColorRequest req) {
        if (req == null || !req.isValid()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ColorResponse.error("Color channels must be integers 0..255", safe(req.r()), safe(req.g()), safe(req.b()), safe(req.w())));
        }
        if (!shelly.isConfigured()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(ColorResponse.error("Bulb IP not configured. Set shelly.ip or SHELLY_IP.", req.r(), req.g(), req.b(), req.w()));
        }
        // Placeholder success until RestClient-based Shelly integration is implemented.
        ColorResponse response = shelly.setColor(req);
        return ResponseEntity.ok(response);
    }

    private int safe(int v) {
        return Math.max(0, Math.min(255, v));
    }
}
