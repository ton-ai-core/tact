contract Test {
    storage: map<Int, Int>;
    
    init() {
        self.storage = emptyMp(); // Should suggest "emptyMap"
    }
    
    receive() {}
}