package com.example.news.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Objects;

public class DobValidator implements ConstraintValidator<DobConstraint, LocalDate> {

    private int min;

    @Override
    // Sử lý data có đúng hay không khi sử dụng annotation
    public boolean isValid(LocalDate localDate, ConstraintValidatorContext constraintValidatorContext) {
        // Kiểm tra xem giá trị data có null không, null thì không tính tuổi
        if(Objects.isNull(localDate)) {
            return true;
        }

        // Tính tuổi
        long years = ChronoUnit.YEARS.between(localDate, LocalDate.now());
        return years >= min;
    }

    @Override
    // Lấy được thông số của annotation(giá trị min), diễn ra trước isValid()
    public void initialize(DobConstraint constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
        min = constraintAnnotation.min(); // Lấy giá trị min nhập trong annotation
    }
}
