/*
package com.example.news.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
@AttributeOverrides({
        @AttributeOverride(name = "id", column = @Column(name = "no_id")),
        @AttributeOverride(name = "createdBy", column = @Column(name = "no_createBy")),
        @AttributeOverride(name = "createdDate", column = @Column(name = "no_createDate")),
        @AttributeOverride(name = "modifiedBy", column = @Column(name = "no_modifiedBy")),
        @AttributeOverride(name = "modifiedDate", column = @Column(name = "no_modifiedDate"))
})
public class Notification extends Base {

    @Column(name = "no_content")
    String content;

    @Column(name = "no_idRead")
    Boolean idRead;

    @ManyToOne
    @JoinColumn(name = "u_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "n_id")
    private News news;

}
*/
