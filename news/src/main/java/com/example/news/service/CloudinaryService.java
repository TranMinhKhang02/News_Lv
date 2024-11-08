package com.example.news.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.Map;

@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Service
public class CloudinaryService {
    Cloudinary cloudinary;
    Cloudinary cloudinaryAudio;
    Cloudinary cloudinaryAvatar;

    public Map<String, Object> uploadFile(File file, String fileName) {
        try {
            Map<String, Object> options = ObjectUtils.asMap(
                    "resource_type", "video",
                    "public_id", fileName // Chỉ định tên file gốc
            );
            return cloudinaryAudio.uploader().upload(file, options);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    /*public Map<String, Object> uploadFile(File file) {
        try {
            Map<String, Object> options = ObjectUtils.asMap("resource_type", "video");
            return cloudinaryAudio.uploader().upload(file, options);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }*/

    /*public Map<String, Object> uploadFile(File file) {
        try {
            Map<String, Object> options = ObjectUtils.asMap("resource_type", "video");
            return cloudinary.uploader().upload(file, options);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }*/

    public Map<String, Object> deleteImage(String publicId) {
        try {
            return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Map<String, Object> uploadImage(File file, String fileName) {
        try {
            Map<String, Object> options = ObjectUtils.asMap(
                    "resource_type", "image"
            );
            return cloudinaryAvatar.uploader().upload(file, options);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    /*public Map deleteImage(String publicId) {
        try {
            return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }*/
}
