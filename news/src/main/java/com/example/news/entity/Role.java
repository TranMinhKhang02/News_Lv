package com.example.news.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@AttributeOverrides({
        @AttributeOverride(name = "id", column = @Column(name = "r_id")),
        @AttributeOverride(name = "createdBy", column = @Column(name = "r_createBy")),
        @AttributeOverride(name = "createdDate", column = @Column(name = "r_createDate")),
        @AttributeOverride(name = "modifiedBy", column = @Column(name = "r_modifiedBy")),
        @AttributeOverride(name = "modifiedDate", column = @Column(name = "r_modifiedDate"))
})
public class Role extends Base {

    @Column(name = "r_name")
    String name;

    @Column(name = "r_code")
    String code;

    @Column(name = "r_description")
    String description;

    @Column(name = "r_categories")
    String categories;

    @Column(name = "r_status")
    int status;

    @OneToMany(mappedBy = "role")
//    @JsonIgnoreProperties("role")
    @JsonBackReference // Tránh vòng lặp
    List<User> users;

}
