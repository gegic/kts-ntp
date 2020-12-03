package rs.ac.uns.ftn.ktsnvt.kultura.controller;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rs.ac.uns.ftn.ktsnvt.kultura.dto.UserDto;
import rs.ac.uns.ftn.ktsnvt.kultura.model.User;
import rs.ac.uns.ftn.ktsnvt.kultura.service.UserService;
import rs.ac.uns.ftn.ktsnvt.kultura.utils.PageableExtractor;

import java.net.URI;


@RestController
@RequestMapping(path = "/api/user", produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController {

    private UserService userService;
    private ModelMapper modelMapper;

    @Autowired
    private UserController(UserService userService, ModelMapper modelMapper) {
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @GetMapping(path = "moderators", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Page<UserDto>> getModerators(@RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "3") int size,
                                                    @RequestParam(defaultValue = "id,desc") String[] sort) {
        Pageable p = PageableExtractor.extract(page, size, sort);
        Page<UserDto> moderatorsDto = this.userService.readAll(p).map(m -> modelMapper.map(m, UserDto.class));
        return ResponseEntity.ok(moderatorsDto);
    }

    @GetMapping(path = "{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserDto> get(@PathVariable String id){
        return ResponseEntity.of(this.userService.readById(Long.parseLong(id))
                .map(u -> modelMapper.map(u, UserDto.class)));
    }

    @PostMapping
    ResponseEntity<UserDto> add(@RequestBody UserDto userDto) throws Exception {
        UserDto saved = this.userService.create(userDto);
        return ResponseEntity.created(URI.create("/api/user/" + saved.getId())).body(saved);
    }

    @PutMapping
    ResponseEntity<UserDto> update(@RequestBody UserDto userDto) throws Exception {
        return ResponseEntity.ok(this.userService.update(userDto));
    }

    @DeleteMapping("{id}")
    ResponseEntity<Void> delete(@PathVariable String id) throws Exception {
        this.userService.delete(Long.parseLong(id));
        return ResponseEntity.ok().build();
    }

}
