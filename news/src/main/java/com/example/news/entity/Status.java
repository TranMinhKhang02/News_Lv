package com.example.news.entity;

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
        @AttributeOverride(name = "id", column = @Column(name = "s_id")),
        @AttributeOverride(name = "createdBy", column = @Column(name = "s_createBy")),
        @AttributeOverride(name = "createdDate", column = @Column(name = "s_createDate")),
        @AttributeOverride(name = "modifiedBy", column = @Column(name = "s_modifiedBy")),
        @AttributeOverride(name = "modifiedDate", column = @Column(name = "s_modifiedDate"))
})
public class Status extends Base {

    @Column
    String name;

    @Column
    String code;

    @Column
    String description;

    @OneToMany(mappedBy = "status")
    List<News> news;

}
