<!-- Kumulipo Wā UI Preview -->
<!-- This shows the structure and appearance of the new Wā expansion interface -->

<section id="wa-preview-guide">
  <!-- AFTER Mark Complete + Scholar/Keiki buttons, users see: -->
  
  <div class="kumulipo-wa-wrapper">
    <div class="kumulipo-wa-container">
      
      <!-- Intro Section -->
      <div class="kumulipo-wa-intro">
        <h4>Explore Each Wā</h4>
        <p>Click any wā below to expand its section. Each wā shows the Hawaiian phrase, English meaning, themes, and key concepts.</p>
        <div class="kumulipo-wa-toggle-info">
          <small>📜 Scholar mode: full depth</small>
        </div>
      </div>

      <!-- Wā Cards (16 total, 1-16) -->
      <div class="kumulipo-wa-sections">
        
        <!-- Example: Wā 1 (Pō Cluster - Green Border Left) -->
        <div class="kumulipo-wa-card" data-wa-num="1">
          <button class="kumulipo-wa-button" type="button" aria-expanded="false">
            <div class="kumulipo-wa-header">
              <span class="kumulipo-wa-num">01</span>
              <div class="kumulipo-wa-titles">
                <span class="kumulipo-wa-hawaiian">Wā o ke Koʻa</span>
                <span class="kumulipo-wa-english">Era of Coral</span>
              </div>
              <i class="fas fa-chevron-down"></i>
            </div>
          </button>
          
          <!-- COLLAPSED: button shows only header + chevron -->
          <!-- ON CLICK: expands to show -->
          <div class="kumulipo-wa-content" hidden>
            <div class="kumulipo-wa-body">
              
              <div class="kumulipo-wa-phrase">
                <strong>ʻŌlelo Hawaiʻi:</strong>
                <p>"Hānau ka koʻa i ka pō"</p>
              </div>

              <div class="kumulipo-wa-translation">
                <strong>English Meaning:</strong>
                <p>Coral life is born in deep darkness.</p>
              </div>

              <div class="kumulipo-wa-lens">
                <strong>Theme:</strong>
                <p>First life in deep pō: coral and earliest sea forms.</p>
                <strong style="display:block;margin-top:0.5rem;">English Learning Lens:</strong>
                <p>Life begins in oceanic darkness.</p>
              </div>

              <div class="kumulipo-wa-concepts">
                <strong>Key Concepts:</strong>
                <div class="kumulipo-wa-concept-tags">
                  <span class="kumulipo-wa-tag">Koʻa (coral)</span>
                  <span class="kumulipo-wa-tag">First paired life</span>
                  <span class="kumulipo-wa-tag">Sacred darkness</span>
                  <span class="kumulipo-wa-tag">Marine genesis</span>
                </div>
              </div>

              <!-- Scholar mode only -->
              <div class="kumulipo-wa-related">
                <strong>Related Lessons:</strong>
                <ul class="kumulipo-wa-related-list">
                  <li><a class="kumulipo-wa-related-link">ke-nun</a></li>
                  <li><a class="kumulipo-wa-related-link">bridge-darkness</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Wā 2-8: Similar structure (Pō cluster, green border) -->
        <!-- Wā 9-16: Similar structure (Ao cluster, gold border) -->
        
      </div>

      <!-- Cluster Info Box -->
      <div class="kumulipo-wa-cluster-info">
        <p><strong>Pō Cluster (Wā 1–8):</strong> Marine emergence, ecology, and life unfolding from darkness.</p>
        <p><strong>Ao Cluster (Wā 9–16):</strong> Genealogy, lineage, light, and human responsibility.</p>
      </div>
    </div>
  </div>

</section>

<!-- KEY FEATURES:

1. VISUAL HIERARCHY
   - Wā number in monospace (01-16)
   - Hawaiian name in serif font (primary)
   - English name in sans-serif (secondary)
   - Chevron icon indicates collapse/expand state

2. COLOR CODING
   - Wā 1-8: LEFT BORDER = Green (#3cb371) — Pō epoch
   - Wā 9-16: LEFT BORDER = Gold (#f0c96a) — Ao epoch

3. INTERACTIVITY
   - Click button to expand/collapse smoothly
   - Related lesson links navigate to that lesson
   - Scholar/Keiki mode toggle updates all sections instantly
   - Hover effects highlight the card

4. CONTENT AREAS (when expanded)
   ✓ ʻŌlelo Hawaiʻi (boxed, green background)
   ✓ English Meaning (boxed, gold background)
   ✓ Theme (plain text)
   ✓ English Learning Lens (Scholar only)
   ✓ Key Concepts (tag-based layout)
   ✓ Related Lessons (Scholar only, clickable)

5. RESPONSIVE
   - Mobile: Reduced padding, adjusted fonts, full width
   - Desktop: Full layout with all features
   - Animations work on all devices

6. MODE SENSITIVITY
   Scholar mode (📜):
     - Shows 4+ concepts per Wā
     - Shows learning lens
     - Shows related lessons (clickable)
   
   Keiki mode (🌺):
     - Shows 2 concepts per Wā
     - Hides learning lens
     - Hides related lessons

7. POSITION IN LESSON
   After:  [Mark Complete] [Scholar] [Keiki] buttons
   Before: Connections section

-->
