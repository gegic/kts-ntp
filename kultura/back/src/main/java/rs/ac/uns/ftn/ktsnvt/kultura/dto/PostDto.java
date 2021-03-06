package rs.ac.uns.ftn.ktsnvt.kultura.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import rs.ac.uns.ftn.ktsnvt.kultura.mapper.EntityKey;
import rs.ac.uns.ftn.ktsnvt.kultura.model.CulturalOffering;

import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDto {

    private Long id;

    @NotBlank(message = "Your post cannot be blank.")
    private String content;

    private LocalDateTime timeAdded;

    @ManyToOne(fetch = FetchType.LAZY)
    @EntityKey(entityType = CulturalOffering.class, fieldName = "culturalOffering")
    private Long culturalOfferingId;

}
