package com.example.news.service;

import com.example.news.dto.request.AdminCreateUserRequest;
import com.example.news.dto.request.UserCreationRequest;
import com.example.news.dto.request.UserUpdateRequest;
import com.example.news.dto.request.UserUpdateRequestByAdmin;
import com.example.news.dto.response.NewsResponse;
import com.example.news.dto.response.userResponse.UserResponse;
import com.example.news.entity.FavoriteEvent;
import com.example.news.entity.News;
import com.example.news.entity.Role;
import com.example.news.entity.User;
import com.example.news.exception.AppException;
import com.example.news.exception.ErrorCode;
import com.example.news.mapper.NewsMapper;
import com.example.news.mapper.UserMapper;
import com.example.news.repository.FavoriteEventRepository;
import com.example.news.repository.NewsRepository;
import com.example.news.repository.RoleRepository;
import com.example.news.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

//@Slf4j
@RequiredArgsConstructor // Thay thế Autowried
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true) // Thay thế private final
@Service
public class UserService {

    UserRepository userRepository;
    UserMapper userMapper;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;
    NewsRepository newsRepository;
    NewsMapper newsMapper;
    FavoriteEventRepository favoriteEventRepository;

    public User createUser(UserCreationRequest request) {
//        Role role = new Role();
        if(userRepository.existsByUserName(request.getUserName()))
            throw new AppException(ErrorCode.USER_EXISTED);

        User user = userMapper.toUser(request);
        user.setStatus(1);

        // Đặt role id mặc định là 2
        Role defaultRole = roleRepository.findById(2L)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy role!"));
        user.setRole(defaultRole);
        // Mã hoá mật khẩu Bcrypt
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    public UserResponse adminCreateUser(AdminCreateUserRequest request, long roleId) {
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy role!"));
        User user = userMapper.toUser(request);
        user.setRole(role);
        user.setStatus(1);
        // Mã hoá mật khẩu Bcrypt
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }

   /* public UserResponse adminCreateUser(AdminCreateUserRequest request) {
        User user = userMapper.toUser(request);
        user = userRepository.save(user);
        return userMapper.toUserResponse(user);
    }*/

    public UserResponse updateUser(long userId, UserUpdateRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user!"));

        userMapper.updateUser(user, request);
        // Mã hoá mật khẩu Bcrypt
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userMapper.toUserResponse(userRepository.save(user));
    }

    public UserResponse updateUserRole(Long userId, UserUpdateRequestByAdmin request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user!"));
        userMapper.updateUserRole(user, request);
        return userMapper.toUserResponse(userRepository.save(user));
    }

    public void deleteUser(long userId) {
        userRepository.deleteById(userId);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<UserResponse> getUserByRoleAndStatus(String roleCode, int status) {
        List<User> users = userRepository.findByRole_codeAndStatus(roleCode, status);
        return users.stream()
                .map(userMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponse getUserById(long id) {
        return userMapper.toUserResponse(userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user!")));
    }

    public UserResponse getUserByUsername(String username) {
        return userMapper.toUserResponse(userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user!")));
    }

    public void favoriteNews(long userId, long newsId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user!"));
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy news!"));
        if (user.getFavoriteNews().contains(news)) {
            throw new AppException(ErrorCode.NEWS_EXISTED);
        }
        user.favorite(news);
        // Start tăng likeCount của bài viết
        if (news.getLikeCount() == null) {
            news.setLikeCount(0L);
        }
        news.setLikeCount(news.getLikeCount() + 1); // Tăng likeCount
        newsRepository.save(news); // Lưu lại bản ghi News đã cập nhật
        // End tăng likeCount

        // Lưu sự kiện vào bảng FavoriteEvent
        FavoriteEvent favoriteEvent = new FavoriteEvent();
        favoriteEvent.setEventDate(LocalDateTime.now());
        favoriteEvent.setNews(news);
        favoriteEventRepository.save(favoriteEvent);

        userRepository.save(user);
    }

    public List<NewsResponse> getFavoriteNewsPageable(long userId, int page, int size) {
        // Tạo PageRequest cho phân trang
        Pageable pageable = PageRequest.of(page - 1, size);

        // Tìm các tin tức yêu thích của user và phân trang
        Page<News> newsPage = newsRepository.findByUsersFavorited_Id(userId, pageable);

        return newsPage.getContent().stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toList());
    }

    public int countAllFavoriteNews(long userId) {
        return (int) newsRepository.countByUsersFavorited_Id(userId);
    }

    public Set<NewsResponse> getFavoriteNews(long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user!"));
        return user.getFavoriteNews().stream()
                .map(newsMapper::toNewsResponse)
                .collect(Collectors.toSet());
    }

    public void deleteFavoriteNews(long userId, long newsId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user!"));
        News news = newsRepository.findById(newsId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy news!"));

        // Xóa các sự kiện yêu thích liên quan trong favorite_event
        favoriteEventRepository.deleteByNewsIdAndUserId(newsId, userId);

        user.getFavoriteNews().remove(news);
        userRepository.save(user);
    }

    public void updateStatus(List<Long> userIds, int status) {
        for(Long userId : userIds) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy user!"));
            user.setStatus(status);
            userRepository.save(user);
        }
    }

    public User loginWithGoogle(String googleId, String email, String fullName, String avatar, LocalDate dob) {
        // Kiểm tra xem người dùng đã tồn tại trong cơ sở dữ liệu hay chưa
        Optional<User> existingUser = userRepository.findByGoogleId(googleId);

        if (existingUser.isPresent()) {
            // Nếu người dùng đã tồn tại, trả về người dùng đó
            return existingUser.get();
        } else {
            // Nếu người dùng chưa tồn tại, tạo tài khoản mới
            User newUser = new User();
            newUser.setGoogleId(googleId);
            newUser.setEmail(email);
            newUser.setFullName(fullName);
            newUser.setAvatar(avatar);
            newUser.setDob(dob);
            newUser.setStatus(1);

            // Đặt role mặc định cho người dùng mới
            Role defaultRole = roleRepository.findById(2L)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy role!"));
            newUser.setRole(defaultRole);

            // Lưu người dùng mới vào cơ sở dữ liệu
            return userRepository.save(newUser);
        }
    }
}
