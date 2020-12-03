package rs.ac.uns.ftn.ktsnvt.kultura.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import rs.ac.uns.ftn.ktsnvt.kultura.mapper.EntityField;
import rs.ac.uns.ftn.ktsnvt.kultura.mapper.EntityKey;
import rs.ac.uns.ftn.ktsnvt.kultura.model.CulturalOffering;
import rs.ac.uns.ftn.ktsnvt.kultura.model.Photo;
import rs.ac.uns.ftn.ktsnvt.kultura.model.User;

import java.time.LocalDateTime;
import java.util.Set;


@NoArgsConstructor
@AllArgsConstructor
public class ReviewDto {

    @Getter
    @Setter
    private long id;

    @Getter
    @Setter
    private int rating;

    @Getter
    @Setter
    private String comment;

    @Getter
    @Setter
    private LocalDateTime timeAdded;

    @Getter
    @Setter
    @EntityKey(entityType = CulturalOffering.class, fieldName = "culturalOffering")
    private long culturalOfferingId;

    @Getter
    @Setter
    @EntityKey(entityType = User.class, fieldName = "user")
    private long userId;

    @Getter
    @Setter
    @EntityField(origin = "user.firstName")
    private String userFirstName;

    @Getter
    @Setter
    @EntityField(origin = "user.lastName")
    private String userLastName;

    @Getter
    @Setter
    @EntityField
    private String userUsername;

    @Getter
    @Setter
    @EntityKey(fieldName = "photos", entityType = Photo.class)
    private Set<Long> photos;
}
