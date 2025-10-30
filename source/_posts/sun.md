---
title: 在 Spring Boot 项目中，将 DTO 或 Entity 对象以 键值对 JSON 格式输出到日志（log）
date: 2025-10-30 22:00:00
tags: [Hexo, 博客]
---
✅ 一、使用 Jackson（推荐）

Spring Boot 默认集成了 Jackson，所以你可以直接用它把对象转成 JSON。

示例代码：

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogUtil {
    private static final Logger log = LoggerFactory.getLogger(LogUtil.class);
    private static final ObjectMapper mapper = new ObjectMapper();

    public static void logAsJson(Object obj) {
        try {
            String json = mapper.writeValueAsString(obj);
            log.info("Object JSON: {}", json);
        } catch (JsonProcessingException e) {
            log.error("Failed to convert object to JSON", e);
        }
    }
}


